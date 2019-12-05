require "img_kit"
require "digest"

module VeemoeCloud
  module Router::Display
    extend self

    macro epu(name)
      context.params.url[{{name}}]
    end

    macro i(path)
      "#{_i}/#{{{path}}}"
    end

    macro o(path, hash)
      "#{_o}/#{{{hash}}}#{File.extname({{path}})}"
    end

    def sign(full_path, params)
      last_modified = modification_time(full_path)
      query_params =
        if params && !params.empty?
          "last_modified=#{last_modified}&#{params}"
        else
          "last_modified=#{last_modified}"
        end
      Digest::MD5.hexdigest("#{full_path}?#{query_params}")[0...16]
    end

    def add_cache_headers(response_headers : HTTP::Headers, last_modified : Time) : Nil
      response_headers["Etag"] = etag(last_modified)
      response_headers["Last-Modified"] = HTTP.format_time(last_modified)
    end

    def etag(modification_time)
      %{W/"#{modification_time.to_unix}"}
    end

    def modification_time(file_path)
      File.info(file_path).modification_time
    end

    def cache_request?(context : HTTP::Server::Context, last_modified : Time) : Bool
      # According to RFC 7232:
      # A recipient must ignore If-Modified-Since if the request contains an If-None-Match header field
      if if_none_match = context.request.if_none_match
        match = {"*", context.response.headers["Etag"]}
        if_none_match.any? { |etag| match.includes?(etag) }
      elsif if_modified_since = context.request.headers["If-Modified-Since"]?
        header_time = HTTP.parse_time(if_modified_since)
        # File mtime probably has a higher resolution than the header value.
        # An exact comparison might be slightly off, so we add 1s padding.
        # Static files should generally not be modified in subsecond intervals, so this is perfectly safe.
        # This might be replaced by a more sophisticated time comparison when it becomes available.
        !!(header_time && last_modified <= header_time + 1.second)
      else
        false
      end
    end

    alias ResizeArgs = NamedTuple(width: Int32, height: Int32)
    alias BlurArgs = NamedTuple(sigma: Float64)
    alias CropArgs = NamedTuple(width: Int32, height: Int32, x: Int32, y: Int32)

    RESIZE_PROCESS_MATCH = /resize\..+/
    BLUR_PROCESS_MATCH   = /blur\..+/
    CROP_PROCESS_MATCH   = /crop\..+/

    def processes(expr)
      pipe =
        Array(Tuple(Symbol, ResizeArgs) |
              Tuple(Symbol, BlurArgs) |
              Tuple(Symbol, CropArgs)).new

      expr.split "/", remove_empty: true do |process|
        if process =~ RESIZE_PROCESS_MATCH
          width, height = parse_resize_process(process)
          pipe << {:resize, {width: width, height: height}}
        elsif process =~ BLUR_PROCESS_MATCH
          sigma = parse_blur_process(process)
          pipe << {:blur, {sigma: sigma}}
        elsif process =~ CROP_PROCESS_MATCH
          width, height, x, y = parse_crop_process(process)
          pipe << {:crop, {width: width, height: height, x: x, y: y}}
        end
      end
      pipe
    end

    def parse_resize_process(expr)
      expr = expr.split(".")[1]
      width = parse_int_value("w", expr)
      height = parse_int_value("h", expr)
      {width, height}
    end

    def parse_blur_process(expr)
      expr = expr.split(".")[1]
      sigma = parse_float_value("s", expr)
      sigma
    end

    def parse_crop_process(expr)
      expr = expr.split(".")[1]
      width = parse_int_value("w", expr)
      height = parse_int_value("h", expr)
      x = parse_int_value("x", expr)
      y = parse_int_value("y", expr)
      {width, height, x, y}
    end

    def parse_int_value(key, expr, default = 0)
      parse_value(key, expr, default).to_i
    end

    def parse_float_value(key, expr, default = 0.0)
      parse_value(key, expr, default).to_f
    end

    def parse_value(key, expr, default = Nil)
      prefix = "#{key}_"
      expr.split ",", remove_empty: true do |value_s|
        if value_s.starts_with? prefix
          return value_s.gsub(prefix, "")
        end
      end
      default
    end

    def process_img(img, processor, args)
      case processor
      when :resize
        if args.is_a?(ResizeArgs)
          img.resize(**args)
        end
      when :blur
        if args.is_a?(BlurArgs)
          img.blur(**args)
        end
      when :crop
        if args.is_a?(CropArgs)
          img.crop(**args)
        end
      end
    end
  end

  Router.def :display, _i : String, _o : String do
    get "/display/:workspace/:path" do |context|
      workspack, path = {epu("workspace"), epu("path")}
      full_path = i("#{workspack}/#{path}")
      hash = sign(full_path, context.request.query)
      output = o(path, hash)
      if File.exists?(output)
        last_modified = modification_time(output)
        add_cache_headers(context.response.headers, last_modified)

        if cache_request?(context, last_modified)
          context.response.status_code = 304
        else
          send_file context, output
        end
      else
        processes_expr = context.params.query["processes"]? || ""
        processor_pipe = processes(processes_expr)
        img = ImgKit::Image.new(full_path)
        processor_pipe.each do |processor, args|
          process_img(img, processor, args)
        end

        img.save(output)
        img.finish

        last_modified = modification_time(output)
        add_cache_headers(context.response.headers, last_modified)

        send_file context, output
      end
    end
  end
end

require "img_kit"
require "digest"

module VeemoeStorage
  module Router::Display
    macro epu(name)
      context.params.url[{{name}}]
    end

    macro i(path)
      "#{_i}/#{{{path}}}"
    end

    macro o(path, hash)
      "#{_o}/#{{{hash}}}#{File.extname({{path}})}"
    end

    def self.sign(path, params)
      Digest::MD5.hexdigest("#{path}?#{params}")[0..8]
    end

    def self.add_cache_headers(response_headers : HTTP::Headers, last_modified : Time) : Nil
      response_headers["Etag"] = etag(last_modified)
      response_headers["Last-Modified"] = HTTP.format_time(last_modified)
    end

    def self.etag(modification_time)
      %{W/"#{modification_time.to_unix}"}
    end

    def self.modification_time(file_path)
      File.info(file_path).modification_time
    end

    def self.cache_request?(context : HTTP::Server::Context, last_modified : Time) : Bool
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
  end

  Router.def :display, _i : String, _o : String do
    get "/display/:workspace/:path" do |context|
      workspack, path = {epu("workspace"), epu("path")}
      full_path = i("#{workspack}/#{path}")
      hash = sign(path, context.request.query)
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
        img = ImgKit::Image.new(full_path)
        img.save(output)
        img.finish
        last_modified = modification_time(output)
        add_cache_headers(context.response.headers, last_modified)
        send_file context, output
      end
    end
  end
end

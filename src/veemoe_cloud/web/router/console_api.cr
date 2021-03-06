module VeemoeCloud
  Router.def :console_api, options: {:prefix => "/console/api"} do
    get "/workspaces" do |context|
      json(context, Business.find_workspace_list)
    end

    post "/workspaces" do |context|
      body = context.params.json

      space = Business.create_workspace!({
        :name        => body["name"].as(String),
        :description => body["description"].as(String),
      })

      json(context, space)
    end

    put "/workspaces/:id" do |context|
      body = context.params.json
      id = context.params.url["id"].to_i

      if space = Business.get_workspace(id)
        Business.update_workspace!(space, {
          :name         => body["name"].as(String),
          :description  => body["description"].as(String),
          :is_protected => body["is_protected"].as(Bool),
        })
        json(context, space)
      else
        json_error(context, "No workspace found: #{id}", status_code: 404)
      end
    end

    delete "/workspaces/:id" do |context|
      id = context.params.url["id"].to_i

      if space = Business.get_workspace(id)
        Business.delete_workspace!(space)
        json(context, OK)
      else
        json_error(context, "No workspace found: #{id}", status_code: 404)
      end
    end

    get "/files/:space_name" do |context|
      space_name = context.params.url["space_name"]
      path = context.params.query["path"]? || "/"

      find_files(context, space_name, path)
    end

    post "/files/:space_name/directories" do |context|
      space_name = context.params.url["space_name"]
      body = context.params.json

      root = body["root"].as(String)
      name = body["name"].as(String)

      create_directory(context, space_name, root, name)
    end

    put "/files/:space_name/rename" do |context|
      space_name = context.params.url["space_name"]
      body = context.params.json

      root = body["root"].as(String)
      old_name = body["old_name"].as(String)
      new_name = body["new_name"].as(String)

      rename_file(context, space_name, root, old_name, new_name)
    end

    delete "/files/:space_name" do |context|
      space_name = context.params.url["space_name"]
      path = context.params.query["path"]

      delete_file(context, space_name, path)
    end

    post "/files/:space_name/upload" do |context|
      space_name = context.params.url["space_name"]
      tempfile = context.params.files["file"].tempfile
      filename = context.params.body["name"].as(String)
      dir = context.params.body["dir"].as(String)

      file_path = File.join [SOURCE_PATH, space_name, dir, filename]

      if file_path.includes?("..")
        json_error(context, ILLEGAL_ACCESS_ERROR)
      else
        File.open(file_path, "w") do |f|
          IO.copy(tempfile, f)
        end
        json_success(context, uploaded: FileItem.new(file_path))
      end
    end

    post "/workspaces/:space_name/pipes" do |context|
      space_name = context.params.url["space_name"]
      body = context.params.json

      if space = Business.find_workspace_by_name(space_name)
        pipe = Business.create_pipe!({
          :workspace_id => space.id,
          :name         => body["name"].as(String),
          :query_params => body["query_params"].as(String),
        })
        json_success(context, pipe: pipe)
      else
        wnf
      end
    end
  end

  module VeemoeCloud::Router::ConsoleApi
    SOURCE_PATH = VeemoeCloud.get_app_env("source_path")

    class FileItem
      JSON.mapping(
        is_directory: Bool,
        name: String
      )

      def initialize(path : String)
        @is_directory = File.directory?(path)
        @name = File.basename(path)
      end
    end

    IGNORES              = [".", ".."]
    ILLEGAL_ACCESS_ERROR = "There is an illegal access path! Cannot contain '..'"

    macro wnf
      json_error(context, "Workspace not found: #{space_name}", status_code: 404)
    end

    def self.find_files(context, space_name, path)
      if space = Business.find_workspace_by_name(space_name)
        fullpath = "#{SOURCE_PATH}/#{space.name}/#{path}"

        unless File.exists?(fullpath)
          return json_error(context, "Path not found: #{path}", status_code: 404)
        end

        if fullpath.includes?("..")
          return json_error(context, ILLEGAL_ACCESS_ERROR)
        end

        unless File.directory?(fullpath)
          return json_error(context, "Path is not a directory: #{path}")
        end

        files = Dir.entries(fullpath).select { |name| !IGNORES.includes?(name) }.map do |name|
          FileItem.new("#{fullpath}/#{name}")
        end

        json(context, {files: files})
      else
        wnf
      end
    end

    def self.create_directory(context, space_name, root, name)
      if root.includes?("..")
        return json_error(context, ILLEGAL_ACCESS_ERROR)
      end
      if space = Business.find_workspace_by_name(space_name)
        rootpath = "#{SOURCE_PATH}/#{space.name}/#{root}"

        unless File.exists?(rootpath)
          return json_error(context, "The root path not found: #{root}", status_code: 404)
        end

        unless File.directory?(rootpath)
          return json_error(context, "The root path is not a directory: #{root}")
        end

        FileUtils.mkdir("#{rootpath}/#{name}")
        json(context, FileItem.new("#{rootpath}/#{name}"))
      else
        wnf
      end
    end

    def self.rename_file(context, space_name, root, old_name, new_name)
      if space = Business.find_workspace_by_name(space_name)
        rootpath = "#{SOURCE_PATH}/#{space.name}/#{root}"

        unless File.exists?(rootpath)
          return json_error(context, "The root path does not exist: #{root}", status_code: 404)
        end

        unless File.directory?(rootpath)
          return json_error(context, "The root path is not a directory: #{root}")
        end

        old_fullpath = "#{SOURCE_PATH}/#{space.name}/#{root}/#{old_name}"
        new_fullpath = "#{SOURCE_PATH}/#{space.name}/#{root}/#{new_name}"

        unless File.exists?(old_fullpath)
          return json_error(context, "The old path does not exist: #{root}/#{old_name}", status_code: 404)
        end

        if old_fullpath.includes?("..") || new_fullpath.includes?("..")
          return json_error(context, ILLEGAL_ACCESS_ERROR)
        end

        FileUtils.mv(old_fullpath, new_fullpath)
        json(context, OK)
      else
        wnf
      end
    end

    def self.delete_file(context, space_name, path)
      if path.starts_with?("/")
        return json_error(context, "The path must not start with '/'")
      end

      if space = Business.find_workspace_by_name(space_name)
        fullpath = "#{SOURCE_PATH}/#{space.name}/#{path}"

        unless File.exists?(fullpath)
          return json_error(context, "Path does not exist: #{path}", status_code: 404)
        end

        if fullpath.includes?("..")
          return json_error(context, ILLEGAL_ACCESS_ERROR)
        end

        FileUtils.rm_r(fullpath)
        json(context, OK)
      else
        wnf
      end
    end
  end
end

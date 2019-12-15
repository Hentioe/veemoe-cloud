module VeemoeCloud
  Business.def :workspace, {:by_name => true} do
    def self.create!(data : Hash)
      Jennifer::Adapter.adapter.transaction do
        space = Workspace.create!(data)
        FileUtils.mkdir("#{SOURCE_PATH}/#{space.name}")
        space
      end.not_nil!
    end

    def self.find_list
      Workspace.all.to_a
    end

    def self.update!(space : Workspace, data : Hash)
      Jennifer::Adapter.adapter.transaction do
        last_name = space.name
        space.update_columns(data)
        if last_name != space.name
          FileUtils.mv("#{SOURCE_PATH}/#{last_name}", "#{SOURCE_PATH}/#{space.name}")
        end
        space
      end.not_nil!
    end

    def self.delete!(space : Workspace)
      Jennifer::Adapter.adapter.transaction do
        FileUtils.rm_r("#{SOURCE_PATH}/#{space.name}")
        space.delete
      end
    end
  end

  module Business::Workspace
    SOURCE_PATH = VeemoeCloud.get_app_env("source_path")
  end
end

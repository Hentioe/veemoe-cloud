module VeemoeCloud
  Business.def :workspace, {:by_name => true} do
    def self.create!(data : Hash)
      Jennifer::Adapter.adapter.transaction do
        space = Workspace.create!(data)
        FileUtils.mkdir("_res/#{space.name}")
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
          FileUtils.mv("_res/#{last_name}", "_res/#{space.name}")
        end
        space
      end.not_nil!
    end

    def self.delete!(space : Workspace)
      Jennifer::Adapter.adapter.transaction do
        FileUtils.rm_r("_res/#{space.name}")
        space.delete
      end
    end
  end
end

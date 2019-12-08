module VeemoeCloud
  Business.def :workspace do
    def self.find_by_name(name : String)
      Workspace.where { _name == name }.first
    end

    def self.create!(data : Hash)
      if data[:is_protected]? == nil
        data = data.merge({:is_protected => true})
      end

      Jennifer::Adapter.adapter.transaction do
        space = Workspace.create!(data)
        FileUtils.mkdir("_res/#{space.name}")
        space
      end.not_nil!
    end

    def self.update!(space : Workspace, data : Hash)
      Jennifer::Adapter.adapter.transaction do
        last_name = space.name
        space.update_columns(data)
        if last_name != space
          FileUtils.mv("_res/#{last_name}", "_res/#{space.name}")
        end
        space
      end.not_nil!
    end

    def self.delete!(name : String)
      Jennifer::Adapter.adapter.transaction do
        if space = find_by_name(name)
          FileUtils.rm_r("_res/#{space.name}")
          space.delete
        end
      end
    end
  end
end

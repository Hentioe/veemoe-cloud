module VeemoeCloud
  Business.def :workspace do
    def self.find_by_name(name : String)
      Workspace.where { _name == name }.first
    end
  end
end

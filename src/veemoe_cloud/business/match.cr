module VeemoeCloud
  Business.def :match do
    def self.create!(data : Hash)
      Match.create!(data)
    end

    def self.update!(match : Match, data : Hash)
      match.update_columns(data)
    end

    def self.delete(match : Match)
      match.delete
    end
  end
end

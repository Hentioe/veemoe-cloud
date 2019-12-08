module VeemoeCloud
  Business.def :style, {:by_name => true} do
    def self.create!(data : Hash)
      Style.create!(data)
    end

    def self.update!(style : Style, data : Hash)
      style.update_columns(data)
    end

    def self.delete(style : Style)
      style.delete
    end
  end
end

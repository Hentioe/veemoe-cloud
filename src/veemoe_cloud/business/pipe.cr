module VeemoeCloud
  Business.def :pipe, {:by_name => true} do
    def self.create!(data : Hash)
      Pipe.create!(data)
    end

    def self.update!(pipe : Pipe, data : Hash)
      pipe.update_columns(data)
    end

    def self.delete(pipe : Pipe)
      pipe.delete
    end
  end
end

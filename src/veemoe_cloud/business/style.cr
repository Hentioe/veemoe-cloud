module VeemoeCloud
  Business.def :style, {:by_name => true} do
    def self.create!(data : Hash,
                     pipes = Array(Int32).new,
                     matches = Array(Int32).new)
      if pipes.size > 0 || matches.size > 0
        Jennifer::Adapter.adapter.transaction do
          style = Style.create!(data)
          pipes.each { |id| style.add_pipes(VeemoeCloud::Model::Pipe.find!(id)) }
          matches.each { |id| style.add_matches(VeemoeCloud::Model::Match.find!(id)) }
          style
        end.not_nil!
      else
        Style.create!(data)
      end
    end

    def self.update!(style : Style,
                     data : Hash,
                     pipes = Array(Int32).new,
                     matches = Array(Int32).new)
      if pipes.size > 0 || matches.size > 0
        Jennifer::Adapter.adapter.transaction do
          source_pipes = style.pipes.map { |pipe| pipe.id }
          added_pipes = pipes.select { |id| !source_pipes.includes?(id) }   # 新列表中不存在于原列表中的项，即添加
          removed_pipes = source_pipes.select { |id| !pipes.includes?(id) } # 原列表中不存在于新列表中的项，即删除

          source_matches = style.matches.map { |match| match.id }
          added_matches = matches.select { |id| !source_matches.includes?(id) }
          removed_matches = source_matches.select { |id| !matches.includes?(id) }

          added_pipes.each { |id| style.add_pipes(VeemoeCloud::Model::Pipe.find!(id)) }
          removed_pipes.each { |id| style.remove_pipes(VeemoeCloud::Model::Pipe.find!(id)) }

          added_matches.each { |id| style.add_matches(VeemoeCloud::Model::Match.find!(id)) }
          removed_matches.each { |id| style.remove_matches(VeemoeCloud::Model::Match.find!(id)) }

          style.update_columns(data)
        end.not_nil!
      else
        style.update_columns(data)
      end
    end

    def self.delete(style : Style)
      style.delete
    end
  end
end

class Workspace < Jennifer::Model::Base
  with_timestamps

  mapping(
    id: Primary32,
    # 名称
    name: String,
    # 描述
    description: String,
    # 是否受保护
    is_protected: Bool,

    created_at: Time?,
    updated_at: Time?,
  )

  has_many :styles, Style
  has_many :pipes, Pipe
  has_many :matches, Match
end

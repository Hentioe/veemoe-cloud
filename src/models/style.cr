class Style < Jennifer::Model::Base
  with_timestamps

  mapping(
    id: Primary32,
    # 名称
    name: String,
    # 描述
    description: String,
    # 关联工作空间
    workspace_id: Int32,

    created_at: Time?,
    updated_at: Time?,
  )

  belongs_to :workspace, Workspace
  has_and_belongs_to_many :matches, Match
  has_and_belongs_to_many :pipes, Pipe
end

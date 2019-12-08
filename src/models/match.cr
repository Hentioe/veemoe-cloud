class Match < Jennifer::Model::Base
  with_timestamps

  mapping(
    id: Primary32,
    # 表达式
    expression: String,
    # 关联工作空间
    workspace_id: Int32,

    created_at: Time?,
    updated_at: Time?,
  )

  belongs_to :workspace, Workspace
  has_and_belongs_to_many :styles, Style
end

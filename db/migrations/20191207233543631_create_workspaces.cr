class CreateWorkspaces < Jennifer::Migration::Base
  def up
    create_table :workspaces do |t|

      t.timestamps
    end
  end

  def down
    drop_table :workspaces if table_exists? :workspaces
  end
end

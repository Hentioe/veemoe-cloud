class CreateStyles < Jennifer::Migration::Base
  def up
    create_table :styles do |t|

      t.timestamps
    end
  end

  def down
    drop_table :styles if table_exists? :styles
  end
end

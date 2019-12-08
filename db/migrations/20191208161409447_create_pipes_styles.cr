class CreatePipesStyles < Jennifer::Migration::Base
  def up
    create_table :pipes_styles, id: false do |t|
      t.reference :pipe, :integer, {:null => false, :on_delete => :cascade}
      t.reference :style, :integer, {:null => false, :on_delete => :cascade}
    end
  end

  def down
    drop_table :pipes_styles if table_exists? :pipes_styles
  end
end

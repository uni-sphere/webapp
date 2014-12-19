class CreateGroupfolders < ActiveRecord::Migration
  def change
    create_table :groupfolders do |t|
      t.string :name
      t.integer :group_id
      t.integer :parent_id
      
      t.timestamps
    end
  end
end
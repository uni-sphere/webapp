class CreateGroupdocuments < ActiveRecord::Migration
  def change
    create_table :groupdocuments do |t|
      t.integer :group_id
      t.integer :parent_id
      t.integer :box_id
      t.string :download_url
      t.string :preview_url
      t.integer :groupfolder_id
      
      t.timestamps
    end
  end
end
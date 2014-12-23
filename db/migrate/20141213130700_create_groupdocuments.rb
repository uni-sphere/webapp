class CreateGroupdocuments < ActiveRecord::Migration
  def change
    create_table :groupdocuments do |t|
      t.integer :box_id
      t.integer :groupfolder_id
      t.string :name
      
      t.timestamps
    end
  end
end
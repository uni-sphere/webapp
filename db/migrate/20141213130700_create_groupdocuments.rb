class CreateGroupdocuments < ActiveRecord::Migration
  def change
    create_table :groupdocuments do |t|
      t.integer :box_id
      t.integer :groupfolder_id
<<<<<<< Updated upstream
=======
      t.string :preview_url
      t.string :download_url
>>>>>>> Stashed changes
      t.string :name
      
      t.timestamps
    end
  end
end
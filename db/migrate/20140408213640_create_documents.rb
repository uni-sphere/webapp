class CreateDocuments < ActiveRecord::Migration
  def change
    create_table :documents do |t|
      t.integer :user_id
      t.attachment :file

      t.timestamps
    end
  end
end

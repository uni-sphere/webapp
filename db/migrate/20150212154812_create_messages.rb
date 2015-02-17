class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.string :content
      t.integer :owner_id
      t.integer :groupchat_id
      
      t.timestamps
    end
  end
end
class CreateBoxtokens < ActiveRecord::Migration
  def change
    create_table :boxtokens do |t|
      t.string :access_token
      t.string :refresh_token
      t.integer :user_id
      
      t.timestamps
    end
  end
end
class CreateBoxtokens < ActiveRecord::Migration
  def change
    create_table :boxtokens do |t|
      t.string :access_token, default: '0'
      t.string :refresh_token, default: '0'
      t.integer :user_id
      
      t.timestamps
    end
  end
end
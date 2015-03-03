class CreateConfirmations < ActiveRecord::Migration
  def change
    create_table :confirmations do |t|
      t.boolean :email_confirmed, default: false
      t.integer :user_id
      
      t.timestamps
    end
  end
end
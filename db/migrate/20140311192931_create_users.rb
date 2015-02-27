class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :salt
      t.string :encrypt_password
      t.boolean :confirmed, default: false

      t.timestamps
    end
  end
end

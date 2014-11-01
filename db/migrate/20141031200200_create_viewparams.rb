class CreateViewparams < ActiveRecord::Migration
  def change
    create_table :viewparams do |t|
      t.integer :user_id
      t.integer :notification_view, default: '0'

      t.timestamps
    end
  end
end
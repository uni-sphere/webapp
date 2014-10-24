class CreateEtherpads < ActiveRecord::Migration
  def change
    create_table :etherpads do |t|
      t.string :name
      t.integer :group_id

      t.timestamps
    end
  end
end

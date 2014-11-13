class CreateMarks < ActiveRecord::Migration
  def change
    create_table :marks do |t|
      t.decimal :score
      t.string :comment
      t.integer :evaluation_id
      t.integer :user_id

      t.timestamps
    end
  end
end
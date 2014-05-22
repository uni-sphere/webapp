# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140408213640) do

  create_table "documents", force: true do |t|
    t.integer  "user_id"
    t.integer  "group_id"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "file_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "relationgroups", force: true do |t|
    t.integer  "user_id"
    t.integer  "group_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "relationgroups", ["group_id"], name: "index_relationgroups_on_group_id"
  add_index "relationgroups", ["user_id", "group_id"], name: "index_relationgroups_on_user_id_and_group_id", unique: true
  add_index "relationgroups", ["user_id"], name: "index_relationgroups_on_user_id"

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "salt"
    t.string   "encrypt_password"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "admin",            default: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true

end

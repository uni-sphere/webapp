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

ActiveRecord::Schema.define(version: 20150222180212) do

  create_table "activities", force: true do |t|
    t.integer  "trackable_id"
    t.string   "trackable_type"
    t.integer  "owner_id"
    t.string   "owner_type"
    t.string   "key"
    t.text     "parameters"
    t.integer  "recipient_id"
    t.string   "recipient_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "activities", ["owner_id", "owner_type"], name: "index_activities_on_owner_id_and_owner_type"
  add_index "activities", ["recipient_id", "recipient_type"], name: "index_activities_on_recipient_id_and_recipient_type"
  add_index "activities", ["trackable_id", "trackable_type"], name: "index_activities_on_trackable_id_and_trackable_type"

  create_table "calendars", force: true do |t|
    t.integer  "user_id"
    t.integer  "group_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "courses", force: true do |t|
    t.string   "name"
    t.decimal  "average",     precision: 2, scale: 0
    t.decimal  "coefficient",                         default: 1.0
    t.integer  "group_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "etherpads", force: true do |t|
    t.string   "name"
    t.integer  "group_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "evaluations", force: true do |t|
    t.string   "name"
    t.decimal  "average",     precision: 2, scale: 0
    t.decimal  "coefficient",                         default: 1.0
    t.integer  "course_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events", force: true do |t|
    t.string   "title"
    t.boolean  "allDay"
    t.datetime "start"
    t.datetime "end"
    t.boolean  "editable"
    t.boolean  "adminevent"
    t.integer  "calendar_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "firepads", force: true do |t|
    t.string   "firebase_url"
    t.string   "name"
    t.integer  "groupfolder_id"
    t.boolean  "deleted",        default: false
    t.string   "owner"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groupchats", force: true do |t|
    t.string   "name"
    t.string   "channel"
    t.integer  "group_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groupdocuments", force: true do |t|
    t.integer  "box_id"
    t.integer  "groupfolder_id"
    t.string   "name"
    t.string   "owner"
    t.integer  "size"
    t.boolean  "deleted",        default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groupfolders", force: true do |t|
    t.string   "name"
    t.integer  "group_id"
    t.integer  "parent_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "marks", force: true do |t|
    t.decimal  "score"
    t.string   "comment"
    t.integer  "evaluation_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "messages", force: true do |t|
    t.string   "content"
    t.integer  "owner_id"
    t.integer  "groupchat_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "microposts", force: true do |t|
    t.string   "content"
    t.integer  "user_id"
    t.integer  "group_id"
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

  create_table "simpledocuments", force: true do |t|
    t.integer  "user_id"
    t.integer  "box_id"
    t.string   "box_name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tasks", force: true do |t|
    t.string   "name"
    t.time     "date"
    t.integer  "group_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

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

  create_table "viewparams", force: true do |t|
    t.integer  "user_id"
    t.integer  "notification_view", default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end

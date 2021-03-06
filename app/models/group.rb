class Group < ActiveRecord::Base
  
	has_many :relationgroups, dependent: :destroy
	has_many :users, through: :relationgroups
	has_many :microposts, dependent: :destroy
	has_many :tasks, dependent: :destroy
  has_one :calendar, dependent: :destroy
  has_many :etherpads, dependent: :delete_all
  has_many :courses, dependent: :delete_all
  has_many :groupfolders, dependent: :delete_all
  has_many :groupchats, dependent: :delete_all
  
end

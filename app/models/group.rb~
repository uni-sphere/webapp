class Group < ActiveRecord::Base

	has_many :relationgroups, dependent: :delete_all
	has_many :users, through: :relationgroups

	

end

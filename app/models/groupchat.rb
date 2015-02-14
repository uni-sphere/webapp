class Groupchat < ActiveRecord::Base
  
	belongs_to :group
  has_many :messages, dependent: :delete_all
  
end
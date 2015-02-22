class Groupfolder < ActiveRecord::Base
  
	belongs_to :group
  has_many :groupdocuments, dependent: :delete_all
  has_many :firepads, dependent: :delete_all
  
end

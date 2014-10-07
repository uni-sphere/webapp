class Relationgroup < ActiveRecord::Base
  include PublicActivity::Common
  
	belongs_to :user
	belongs_to :group
  
end

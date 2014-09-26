class Calendar < ActiveRecord::Base
  include PublicActivity::Model
  tracked owner: Proc.new{ |controller, model| controller.current_user }
    
	belongs_to :user
	has_many :events

end

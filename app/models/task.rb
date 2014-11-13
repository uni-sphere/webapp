class Task < ActiveRecord::Base
  
  include PublicActivity::Model
  tracked except: :destroy, owner: Proc.new{ |controller, model| controller.set_group }, recipient: Proc.new{ |controller, model| controller.current_user }
  belongs_to :user
  belongs_to :group
  
end

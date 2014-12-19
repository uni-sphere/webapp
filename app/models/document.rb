class GroupdocumentsController < ActiveRecord::Base
  # include PublicActivity::Model
  # tracked owner: Proc.new{ |controller, model| controller.set_group }
  # tracked recipient: Proc.new{ |controller, model| controller.current_user }

	belongs_to :user

end

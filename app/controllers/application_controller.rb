class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include SessionsHelper
  def is_admin?
    if current_user.nil?
        redirect_to(root_path)

    end
	redirect_to(root_path) unless current_user.admin?	
    end
end

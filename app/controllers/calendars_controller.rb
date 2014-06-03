class CalendarsController < ApplicationController

  before_action :calendar_params, only: [:create]
  before_action :set_user
  before_action :set_calendar, :only => [:show, :destroy]
  #before_filter :correct_user, :only => [:edit, :update]
  #before_filter :authenticate?, :only => [:edit, :update, :index, :destroy, :show]
  #before_filter :not_authenticate?, :only => [:new, :create]
  #before_filter :is_admin?, :only => [:destroy]
  
	def new
		@calendar = @user.calendars.new
	end

	def create
		@calendar = @user.calendars.new(calendar_params)
    		respond_to do |format|
     		 if @calendar.save
     		   format.html { redirect_to user_calendars_path, notice: 'Document was successfully created.' }
     		   format.json { render action: 'show', status: :created, location: @calendar }
     		 else
     		   format.html { render action: 'new' }
     		   format.json { render json: @calendar.errors, status: :unprocessable_entity }
     		 end
   		end
	end

	def index
		@calendars = @user.calendars.all
	end

	def show
		
	end

	def destroy
		@calendar.destroy
    		respond_to do |format|
   		   format.html { redirect_to user_calendars_path }
   		   format.json { head :no_content }
    		end
	end

private
	
	def calendar_params
     		params.require(:calendar).permit(:name)
  	end

	def set_user
		@user = User.find(params[:user_id]) 
	end

	def set_calendar
		@calendar = Calendar.find(params[:id]) 
	end

end

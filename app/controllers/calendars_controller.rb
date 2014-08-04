class CalendarsController < ApplicationController

  before_action :calendar_params, only: [:create]
  before_action :set_user
  before_action :set_calendar, only: [:show, :destroy]
  before_filter :correct_user, only: [:new, :edit, :update, :show, :destroy, :index]
  before_filter :authenticate?
 
  
	def new
		@calendar = @user.calendars.new
	end

	def create
		@calendar = @user.calendars.new(calendar_params)
    		respond_to do |format|
     		 if @calendar.save
     		   format.html { redirect_to user_calendars_path, notice: 'Document was successfully created.' }
     		   format.json { render action: 'index', status: :created, location: @event }
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
		@events = @calendar.events.all
			respond_to do |format|
				format.html	
		      		format.json { render json: @events }
		    	end
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
		if params[:format] != nil and params[:format] == 'json'
			@calendar = Calendar.find(params[:calendar_id])
		else
			@calendar = Calendar.find(params[:id]) 
		end
	end

end

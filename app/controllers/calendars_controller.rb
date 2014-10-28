class CalendarsController < ApplicationController
  
  respond_to :html
  
  before_action :authenticate?
  before_action :calendar_params, only: [:create]
  before_action :set_target
  before_action :set_user
  before_action :correct_user?
  before_action :set_calendar, only: [:show, :destroy]
 
	def new
		@calendar = @target.calendars.new
	end

	def create
		@calendar = @target.calendars.new(calendar_params)
    respond_to do |format|
      if @calendar.save
     	  format.html { redirect_to root_path }
     		format.json { render action: 'index', status: :created, location: @event }
     	else
     		format.html { render action: 'new' }
     		format.json { render json: @calendar.errors, status: :unprocessable_entity }
     	end
   	end
	end

	def index
		@calendars = @target.calendars.all
	end

	def show
		@events = @calendar.events
		respond_to do |format|
		  format.html	{  }
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

	def set_calendar
		if params[:format] != nil and params[:format] == 'json'
			@calendar = Calendar.find(params[:calendar_id])
		else
			@calendar = Calendar.find(params[:id]) 
		end
	end

end

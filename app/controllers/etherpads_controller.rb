class EtherpadsController < ApplicationController
  
  before_action :etherpad_params, only: [:create, :delete]
  before_action :set_group
  before_action :set_user
  
  def create
	  @etherpad = @group.etherpads.new(etherpad_params)
    respond_to do |format|
      if @etherpad.save
        format.html { redirect_to user_group_path(@user, @group) }
        format.json { render action: 'show', status: :created, location: @document }
      else
        format.html { render action: 'new' }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end
    
  def destroy
    @etherpad = Etherpad.find(params[:id])
		@etherpad.destroy
		respond_to do |format|
		  format.html { redirect_to user_group_path(@user, @group) }
		  format.json { head :no_content }
    end
  end
    
  def show
    @etherpad = Etherpad.find(params[:id]) 
    # ether = EtherpadLite.connect(3000, File.new('etherpad_test.txt'))
#     author = ether.author("my_app_user_#{current_user.id}", name: current_user.name)
#     sess = session[:id][@group.id] ? ether.get_session(session[:id][@group.id]) : @group.create_session(author, 120)
#     if sess.expired?
#       sess.delete
#       sess = @group.create_session(author, 120)
#     end
#     session[:id][@group.id] = sess.id
  end
    
  # def index
  #   # Your users are probably members of some kind of groups.
  #   # These groups can be mapped to EtherpadLite Groups. List all the user's groups.
  #   @app_groups = current_user.groups
  # end

  # /etherpad/groups/:id
  def group
    ether = EtherpadLite.connect(9001, File.new('/srv/www/etherpad-lite/APIKEY.txt'))
    @app_group = YourAppGroup.find(params[:id])
    # Map your app's group to an EtherpadLite Group, and list all its pads
    group = ether.group("my_app_group_#{@app_group.id}")
    @pads = group.pads
  end

  # /etherpad/pads/:ep_group_id/:ep_pad_name
  def pad
    ether = EtherpadLite.connect(9001, File.new('/srv/www/etherpad-lite/APIKEY.txt'))
    # Get the EtherpadLite Group and Pad by id
    @group = ether.get_group(params[:ep_group_id])
    @pad = @group.pad(params[:ep_pad_name])
    # Map the user to an EtherpadLite Author
    author = ether.author("my_app_user_#{current_user.id}", name: current_user.name)
    # Get or create an hour-long session for this Author in this Group
    sess = session[:ep_sessions][@group.id] ? ether.get_session(session[:ep_sessions][@group.id]) : @group.create_session(author, 60)
    if sess.expired?
      sess.delete
      sess = @group.create_session(author, 60)
    end
    session[:ep_sessions][@group.id] = sess.id
    # Set the EtherpadLite session cookie. This will automatically be picked up by the jQuery plugin's iframe.
    cookies[:sessionID] = {value: sess.id, domain: ".yourdomain.com"}
  end
  
  private

  def etherpad_params
    params.require(:etherpad).permit(:name)
  end
end
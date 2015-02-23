class FirepadsController < ApplicationController
  
  before_action :get_firepad, except: [:create, :move]
  
  def create
    @groupfolder = current_group.groupfolders.find params[:groupfolder_id]
    if @groupfolder.firepads.create(firebase_url: random_key, name: 'New Firepad', groupfolder_id: params[:groupfolder_id], owner: current_user.id)
      # render json:
    else
      # render json:
    end
  end
  
  def read
    @firepadRef = @firepad.firebase_url
  end
  
  def update
    if @firepad.update(name: params[:name])
      render :nothing => true
    else 
      logger.info 'PROBLEME'
    end
  end
  
  def move
    @firepad = Firepad.find params[:dragged]
    @firepad.update(groupfolder_id: params[:dropped])
    render :nothing => true
  end
  
  def destroy
    @firepad.update(deleted: true)
    render :nothing => true
  end
  
  private

  def get_firepad
    @firepad = Firepad.find params[:firepad_id] if params[:firepad_id]
  end
  
end
class DocumentsController < ApplicationController
  before_action :set_document, only: [:show, :edit, :update, :destroy]
  before_action :set_target, only: [:new, :show, :edit, :update, :destroy, :create]
  
  def index
    @documents = Document.all
  end

  def show
  end

  def new
    @document = @target.documents.new
  end

  def edit
  end

  def create
    @document = @target.documents.new(params[:file])
    respond_to do |format|
      if @document.save
        format.html { redirect_to user_documents_path, notice: 'Document was successfully created.' }
        format.json { render action: 'show', status: :created, location: @document }
      else
        format.html { render action: 'new' }
        format.json { render json: @document.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @document.update(document_params, user: current_user)
        format.html { redirect_to @document, notice: 'Document was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @document.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @document.destroy
    respond_to do |format|
      format.html { redirect_to documents_url }
      format.json { head :no_content }
    end
  end

  private

    def set_target
      if request.original_url =~ /groups(.*)/
	@target = Group.find(params[:group_id])    	
      else
        @target = User.find(params[:user_id])
      end
    end

    def set_document
      @document = @target.documents.find(params[:id])
    end

    def document_params
      params.require(:document).permit(:user_id, :group_id, :file)
    end
end

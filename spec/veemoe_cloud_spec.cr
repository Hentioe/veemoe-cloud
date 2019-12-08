require "./spec_helper"

alias Style = VeemoeCloud::Business::Style
alias Workspace = VeemoeCloud::Business::Workspace
alias Pipe = VeemoeCloud::Business::Pipe
alias Match = VeemoeCloud::Business::Match

describe VeemoeCloud do
  describe VeemoeCloud::Router::Display do
    it "parse_conv" do
      format = VeemoeCloud::Router::Display.parse_conv("?conv.webp/resize.w_100")
      format.should eq(".webp")
    end
  end

  describe VeemoeCloud::Business::Workspace do
    space = Workspace.create!({:name => "test-space", :description => "测试空间"})
    space.should be_truthy
    space.name.should eq("test-space")
    space.description.should eq("测试空间")

    begin
      Workspace.create!({:name => "demo", :description => "将要创建失败的空间。"})
    rescue e
      e.message.should eq("Unable to create directory '_res/demo': File exists")
      space = Workspace.find_by_name("demo")
      space.should be_falsey
    end

    space = Workspace.find_by_name("test-space")
    space.should be_truthy

    Workspace.update!(space.not_nil!, {:name => "test-space1"})
    File.exists?("_res/test-space1").should be_true

    Workspace.delete!(space.not_nil!)

    space = Workspace.find_by_name("test-space1")
    space.should be_falsey

    File.exists?("_res/test-space1").should be_false
  end

  describe VeemoeCloud::Business::Style do
    begin
      Style.create!({:name => "style-1", :description => "无", :workspace_id => 0})
    rescue e
      e.message.not_nil!.should start_with("FOREIGN KEY constraint failed.")
    end

    space = Workspace.create!({:name => "test-space", :description => "测试空间"})
    style = Style.create!({:name => "style-1", :description => "无", :workspace_id => space.id})

    style.name.should eq("style-1")
    style.description.should eq("无")

    style.should be_truthy

    Style.update!(style, {:name => "updated_style", :description => "更新后的描述。"})
    style.name.should eq("updated_style")
    style.description.should eq("更新后的描述。")

    style = Style.find_by_name("updated_style")
    style.should be_truthy

    Style.delete(style.not_nil!)

    style = Style.find_by_name("updated_style")
    style.should be_nil

    # 测试创建和更新关联项目（管道和匹配）
    pipe1 = Pipe.create!({:name => "pipe-1", :query_params => "q-1", :workspace_id => space.id})
    pipe2 = Pipe.create!({:name => "pipe-2", :query_params => "q-2", :workspace_id => space.id})

    pipes = [{:id => pipe1.id}, {:id => pipe2.id}]

    match1 = Match.create!({:expression => "/*", :workspace_id => space.id})
    match2 = Match.create!({:expression => "/10001/*", :workspace_id => space.id})

    pipes = [pipe1.id, pipe2.id]
    matches = [match1.id, match2.id]

    style2 = Style.create!({:name => "style-2", :description => "无", :workspace_id => space.id},
      pipes: pipes, matches: matches)

    style2.pipes.size.should eq(2)
    style2.matches.size.should eq(2)

    pipe3 = Pipe.create!({:name => "pipe-3", :query_params => "q-3", :workspace_id => space.id})
    match3 = Match.create!({:expression => "/10002/*", :workspace_id => space.id})

    new_pipes = [pipe1.id, pipe3.id]
    new_matches = [match1.id, match3.id]
    Style.update!(style2, {:description => "分别删除并添加一个管道和匹配"},
      pipes: new_pipes, matches: new_matches)

    style2.pipes.size.should eq(2)
    style2.matches.size.should eq(2)

    style2.pipes.last.id.should eq(pipe3.id)
    style2.matches.last.id.should eq(match3.id)

    begin
      Style.create!({:name => "style-2", :description => "无", :workspace_id => space.id})
    rescue e
      e.message.not_nil!.should start_with("UNIQUE constraint failed: styles.workspace_id, styles.name.")
    end

    Workspace.delete!(space)

    style2 = Style.find_by_name("style-2")
    style2.should be_nil
  end
end

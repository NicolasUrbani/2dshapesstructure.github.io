clear all; close all;

load userstudy2-processed

% Number of parts proposed to users
nb_parts_total = 0;
for k = 1:size(parts,1)
    nb_parts_total = nb_parts_total + parts(k,3) + parts(k,4);
end

disp([int2str(nb_parts_total) ' parts were proposed to users'])
disp('-------')


% Number of teams who finished the 25 tasks
teams_annot_nb = zeros(size(teams,1),1);

for ind_team = 1:size(teams,1)

	annot_team = partsannotation(partsannotation(:,1)==ind_team,:);
	nb_annot = size(unique(annot_team(:,2:3),'rows'),1);
	teams_annot_nb(ind_team) = nb_annot;

end

disp([int2str(length(find(teams_annot_nb))) ' teams have started the experiment'])
disp([int2str(length(find(teams_annot_nb==25))) ' teams have completed the experiment'])
disp('-------')

% Gold Standard
gs_perf = zeros(size(teams,1),5);
GS{1}.part = 1905;
GS{1}.expected = [1904 1906 1907];
GS{2}.part = 344;
GS{2}.expected = [343 345 346];
GS{3}.part = 1691;
GS{3}.expected = [1687 1688 1689 1690 1692 1693 1694];
GS{4}.part = 354;
GS{4}.expected = [353];
GS{5}.part = 734;
GS{5}.expected = [736 737 738];

gs_perf = -Inf*ones(size(teams,1),5);
gs_jacc = -Inf*ones(size(teams,1),5);
for ind_team = 1:size(teams,1)
    for ind_GS = 1:5
        annot_team = partsannotation(partsannotation(:,1)==ind_team,:);
        GS_answer_team = annot_team(annot_team(:,3)==GS{ind_GS}.part,4);
        
        gs_perf(ind_team,ind_GS) = length(intersect(GS_answer_team,GS{ind_GS}.expected)) == length(union(GS_answer_team,GS{ind_GS}.expected));
        if ~isempty(GS_answer_team)
            gs_jacc(ind_team,ind_GS) = length(intersect(GS_answer_team,GS{ind_GS}.expected)) / length(union(GS_answer_team,GS{ind_GS}.expected));
        end
    end
    
end

disp([int2str(length(find(sum(gs_perf,2)==5))) ' teams answered correctly to 5 GS shapes'])
disp([int2str(length(find(sum(gs_perf,2)==4))) ' teams answered correctly to 4 GS shapes'])
disp([int2str(length(find(sum(gs_perf,2)==3))) ' teams answered correctly to 3 GS shapes'])
disp([int2str(length(find(sum(gs_perf,2)==2))) ' teams answered correctly to 2 GS shapes'])
disp([int2str(length(find(sum(gs_perf,2)==1))) ' teams answered correctly to 1 GS shapes'])
disp([int2str(length(find(sum(gs_perf,2)==0))) ' teams answered correctly to 0 GS shapes'])
disp('-------')

disp([int2str(sum(gs_perf(:,1))) ' teams answered correctly to the 1st GS shape'])
disp([int2str(sum(gs_perf(:,2))) ' teams answered correctly to the 2nd GS shape'])
disp([int2str(sum(gs_perf(:,3))) ' teams answered correctly to the 3rd GS shape'])
disp([int2str(sum(gs_perf(:,4))) ' teams answered correctly to the 4th GS shape'])
disp([int2str(sum(gs_perf(:,5))) ' teams answered correctly to the 5th GS shape'])
disp('-------')


teamscore_with = mean(gs_jacc(:,1:2:5),2)+0.01*rand(size(gs_perf,1),1);
teamscore_without = mean(gs_jacc(:,2:2:4),2)+0.01*rand(size(gs_perf,1),1);

figure;
plot(teamscore_with, teamscore_without,'b.');
xlabel('Average Jaccard on GS shapes with context');
ylabel('Average Jaccard on GS shapes without context');
axis([-0.1 1.1 -0.1 1.1])


best_teams = find(sum(gs_perf,2)==5);
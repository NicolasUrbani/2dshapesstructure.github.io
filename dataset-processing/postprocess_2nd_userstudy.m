clear all; close all;

load userstudy2

parts_cell = parts;

parts = zeros(size(parts_cell,1),4);

for k=1:size(parts_cell,1)
   parts(k,1) = parts_cell{k,2};
   parts(k,2) = parts_cell{k,3};
   parts(k,3) = parts_cell{k,4};
   parts(k,4) = parts_cell{k,5};
end


partsannotation_cell = partsannotation;
% partsannotation = zeros(size(partsannotation_cell,1),4);
load partsannotation_tmp

%%%%%%%%%%%%%%%%%%%% PROBLEM k = 101548
% for k = 1:size(partsannotation_cell,1)
for k = 101548:size(partsannotation_cell,1)
   
    if mod(k,1000)==0
        disp(int2str(k))
    end
    
   % Look for team name
   found = 0;
   ind_team = 1;
   while found == 0
       if compareNames(partsannotation_cell{k,2}, teams{ind_team,2})
           found = 1;
       else
           ind_team = ind_team+1;
       end
   end
   if found
        partsannotation(k,1) = ind_team;
   end
   partsannotation(k,2) = partsannotation_cell{k,3};
   partsannotation(k,3) = partsannotation_cell{k,4};
   partsannotation(k,4) = partsannotation_cell{k,5};
    
    
end












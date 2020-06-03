load('userstudy2.mat');

partsannotationwith = [];
partsannotationwithout = [];

for i=1:size(partsannotation,1)
    %display(i);
    if mod(i,1000) == 0
        display(i);
    end
    if (partsannotation{i,3} == 0)
        partsannotationwithout = [ partsannotationwithout ; partsannotation(i,:) ];
    else
        partsannotationwith = [ partsannotationwith ; partsannotation(i,:) ];
    end
end
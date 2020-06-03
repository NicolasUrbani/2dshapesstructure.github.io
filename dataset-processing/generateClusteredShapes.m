% Generate all shapes with/without context (definite positive?)
% using spectral clustering

clear all; close all;

load userstudy2_1.mat

if ~exist('Results/SpectralParts')
    mkdir('Results/SpectralParts')
end

%for i=1:size(selection,1)
for i=1:1
    
    s = readJSON(['JSON/' selection{i,2} '.json']);
    sp = readJSONParts(['JSON/Parts/' selection{i,2} '_' int2str(selection{i,3}) '.json']);
    
    % Compute main parts of the shape
    hierarchy_0 = find(sp.hierarchy == 0);
    main_parts = [];
    for j=1:length(hierarchy_0)
        main_parts = [ main_parts ; sp.parts(hierarchy_0(j)) ];
    end
    main_parts = unique(main_parts);
    
    [result_clust_with, result_clust_without, defpos_with, defpos_without] = partsSpectralClustering(selection{i,1});
    pause
    
    h = figure

    a = subplot(1,2,1);
    displayShapePartsClust(s,sp.parts,main_parts,result_clust_with);
    ta = title(a, ['with context (' int2str(defpos_with) ')']);
    
    b = subplot(1,2,2);
    displayShapePartsClust(s,sp.parts,main_parts,result_clust_without);
    tb = title(b, ['without context (' int2str(defpos_without) ')']);

    saveas(h, ['Results/SpectralParts/' selection{i,2} '_' int2str(selection{i,3}) '.png']);
    clear s sp h result_clust_with result_clust_without a b defpos_with defpos_without ta tb
    close all
end
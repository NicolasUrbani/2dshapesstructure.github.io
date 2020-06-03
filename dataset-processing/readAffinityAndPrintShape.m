clear all; close all;

load clustering_data.mat

for i=1:size(selection,1)
    
    % Read the JSON files containing the shapes structure and hierarchy
    s = readJSON(['JSON/' selection{i,2} '.json']);
    sp = readJSONParts(['JSON/Parts/' selection{i,2} '_' int2str(selection{i,3}) '.json']);
    
    % Compute main parts of the shape
    hierarchy_0 = find(sp.hierarchy == 0);
    main_parts = [];
    for j=1:length(hierarchy_0)
        main_parts = [ main_parts ; sp.parts(hierarchy_0(j)) ];
    end
    main_parts = unique(main_parts);
    
    % Load the 2 affinity matrices:
    % affinity_matrix_with and affinity_matrix_without
    load(['Results/Affinity/' selection{i,2} '.mat'])
    
    % HERE INCLUDE THE CLUSTERING OF THE TWO AFFINITY MATRICES
    % WRITE THE RESULTS INTO TWO VARIABLES: result_clust_with and 
    % result_clust_without
    
    
     
    %%% COMMENT ONCE CLUSTERING WAS ADDED 
    % Display the Affinity matrices and the shape decomposition
    figure;
    set(gcf, 'Position', get(0, 'Screensize'));
    subplot(1,3,1)
    imshow(affinity_matrix_with)
    colormap default
    caxis([0 1])
    colorbar
    title('With Context')
    
    subplot(1,3,2)
    imshow(affinity_matrix_without)
    colormap default
    caxis([0 1])
    colorbar
    title('Without context')
    
    subplot(1,3,3)
    displayShapeParts(s,sp.parts)
    
    
    %%% UNCOMMENT ONCE CLUSTERING WAS ADDED
%     % Display the Affinity matrices and the shape decomposition
%     figure;
%     set(gcf, 'Position', get(0, 'Screensize'));
%     
%     subplot(2,2,1)
%     imshow(affinity_matrix_with)
%     colormap default
%     caxis([0 1])
%     colorbar
%     title('With Context')
%     
%     subplot(2,2,2)
%     displayShapePartsClust(s,sp.parts,main_parts,result_clust_with);
%     title('Parts similarities with context');
%     
%     subplot(2,2,3)
%     imshow(affinity_matrix_without)
%     colormap default
%     caxis([0 1])
%     colorbar
%     title('Without context')
%     
%     subplot(2,2,4)
%     displayShapePartsClust(s,sp.parts,main_parts,result_clust_without);
%     title('Parts similarities without context');
    
    pause(0.1)

    close all
         
end
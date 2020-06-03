function [result_clust_with, result_clust_without, defpos_with, defpos_without] = partsSpectralClustering(idSelection)
    
    % Compute the affinity matrix of the annotations
    [ affinity_matrix_with, affinity_matrix_without, n ] = computeAffinityMatrix(idSelection);
    
    defpos_with = all(eig(affinity_matrix_with) > eps);
    defpos_without = all(eig(affinity_matrix_without) > eps);

    % Compute the optimal number of clusters using the Silhouette Value
    % criteria (not defined)
    % with context
    SV_with(1) = 0;
    for nbClust_with = 2:n
        clust_with =  ngJordanWeissSpectralClustering(affinity_matrix_with,nbClust_with);
        SV_with(nbClust_with) = computeSilhouetteValue(affinity_matrix_with,clust_with);
    end
    
    % plot the graph of SV
    %h = figure
    %subplot(1,2,1);
    %plot(SV_with);
    
    [aux_with,nbClust_with] = max(SV_with);
    
    % without context
    SV_without(1) = 0;
    for nbClust_without = 2:n
        clust_without =  ngJordanWeissSpectralClustering(affinity_matrix_without,nbClust_without);
        SV_without(nbClust_without) = computeSilhouetteValue(affinity_matrix_without,clust_without);
    end
    
    %subplot(1,2,2);
    %plot(SV_without);
    %saveas(h, 'graphe', 'jpg');
    
    [aux_without,nbClust_without] = max(SV_without);
    
    % Cluster the annotations using the Jordan-Weiss method with context
    result_clust_with =  ngJordanWeissSpectralClustering(affinity_matrix_with,nbClust_with);
    
    % Cluster the annotations using the Jordan-Weiss method without context
    result_clust_without =  ngJordanWeissSpectralClustering(affinity_matrix_without,nbClust_without);

end

function SV = computeSilhouetteValue(aff,idx)

    % Number of parts of the shape except the main shape
    N = length(idx);
    % Number of clusters
    nbClust = max(idx);

    % 2nd solution with permutation on the affinity matrix
    aff_aux = aff;
    curr_i = 1;
    
    % vector used for permutation of the affinity matrix
    aff_index =[];
    for aff_i=1:N
        aff_index = [ aff_index ; aff_i ];
    end
    
    for c=1:nbClust
        c_index = find(idx == c);
        for c_idx=1:length(c_index)
            % Permutation in the vector aff_index
            inter = aff_index(curr_i);
            index_c_idx = find(aff_index == c_index(c_idx));
            aff_index(curr_i) = aff_index(index_c_idx);
            aff_index(index_c_idx) = inter;
            curr_i = curr_i + 1;
            
        end
    end
    
    % Permute the affinity matrix like the vector aff_index
    aff_aux = aff_aux(:,aff_index);
    aff_aux = aff_aux(aff_index,:);
        
    % Vector containing the Silhouette Values
    Si = [];
    % number of parts per cluster
    nbParts_clust = [];
    for clust=1:nbClust
        clust_index = find(idx == clust);
        nbParts_clust = [ nbParts_clust ; length(clust_index) ];
    end
    
    for i=1:nbClust
        clust_index = find(idx == i);
        
        if (i == 1)
            bl = 1; % beginning line for computing the norm of bi_mat
        else
            bl = 1 + sum(nbParts_clust(1:i-1));
        end
        el = sum(nbParts_clust(1:i)); % ending line
        
        bi_aux = [];
        
        for j=1:nbClust
            if (j ~= i)
                if (j == 1)
                    bc = 1; % beginning column
                else
                    bc = 1 + sum(nbParts_clust(1:j-1));
                end
                ec = sum(nbParts_clust(1:j)); % ending column
                
                taille = size(aff_aux(bl:el,bc:ec));
                I = ones(taille(1),taille(2));
                
                bi_mat = I - aff_aux(bl:el,bc:ec);
                
                bi_aux = [ bi_aux ; norm(bi_mat,2) ];
            end
        end
        
        if (isempty(bi_aux))
            v = 0;
        else
            v = min(bi_aux);
        end
        
        for k=1:length(clust_index)
            bi(clust_index(k)) = v;
        end
    end
        
    for p=1:N
        % Cluster number
        num_clust_p = idx(p);
        % Compute the distance of point i to its own cluster
        cluster_index = find(idx == num_clust_p); % parts belonging to the same cluster
        dist_own = [];
        for k=1:length(cluster_index)
            if (cluster_index(k) ~= p)
                dist_own = [ dist_own ; 1 - aff(p,cluster_index(k)) ];
            end
        end
        
        if (length(cluster_index) <= 1)
            ai(p) = 0;
        else
            ai(p) = 1 / (length(cluster_index)-1) * sum(dist_own);
        end
    end
    
    for index=1:N
        if (index <= min(length(ai),length(bi)) && ~(ai(index) == 0 && max(ai(index),bi(index)) == ai(index)) && ~(bi(index) == 0 && max(ai(index),bi(index)) == 0))
            Si = [ Si ; (bi(index) - ai(index)) / max(ai(index),bi(index)) ];
        end
    end
    
    SV = 1 / N * sum(Si);
    
% 1st solution
%     % Vector containing the Silhouette Values
%     Si = [];
%     
%     for i=1:N
%         
%         % Cluster number
%         num_clust_i = idx(i);
%         
%         bi_aux = [];
%         
%         for ind_c=1:nbClust
%             if (ind_c ~= num_clust_i)
%                 ind_c_index = find(idx == ind_c); % parts belonging to cluster ind_c
%                 dist_other = [];
%                 if (length(ind_c_index) ~= 0)
%                     for j=1:length(ind_c_index)
%                         dist_other = [ dist_other ; 1 - aff(i,ind_c_index(j)) ];
%                     end
%                     bi_aux = [ bi_aux ; 1 / length(ind_c_index) * sum(dist_other) ];
%                 end
%             end
%         end
%         
%         if (isempty(bi_aux))
%             bi = 0;
%         else
%             bi = min(bi_aux);
%         end
%         
%         % Compute the distance of point i to its own cluster
%         cluster_index = find(idx == num_clust_i); % parts belonging to the same cluster as i
%         dist_own = [];
%         for k=1:length(cluster_index)
%             if (cluster_index(k) ~= i)
%                 dist_own = [ dist_own ; 1 - aff(i,cluster_index(k)) ];
%             end
%         end
%         
%         if (length(cluster_index) <= 1)
%             ai = 0;
%         else
%             ai = 1 / (length(cluster_index)-1) * sum(dist_own);
%         end
%         
%         if (~(ai == 0 && bi == 0))
%             Si = [ Si ; (bi - ai) / max(ai,bi) ];
%         end
%     end
%     
%     SV = 1 / N * sum(Si);
    
end

% Implements the spectral clustering described in 
% Ng, A., Jordan, M., and Weiss, Y. (2002). On spectral clustering: 
% analysis and an algorithm
% Takes an affinity matrix as an input and the desired number of clusters k
function indices = ngJordanWeissSpectralClustering(A,k)
    %A
    % Define D to be the diagonal matrix whose (i, i)-element is the 
    % sum of A's i-th row
    for i=1:size(A,1)
        D(i,i) = sum(A(i,:));
    end

    %D
    L = zeros(size(A));
    % construct the matrix L = D^(-1/2) A D^(-1/2) 
    for i=1:size(A,1)
        for j=1:size(A,2)
            L(i,j) = A(i,j) / (sqrt(D(i,i)) * sqrt(D(j,j)));  
        end
    end
    
    %L
    % Find x1, x2, ..., xk, the k largest eigenvectors of L ...
    [x,aux] = eig(L);
    
    % ... and form the matrix X = [X1 X2 ... Xk] by stacking the eigenvectors 
    % in columns. 
    X = x(:,(size(x,1)-(k-1)): size(x,1));
    %X
    % Form the matrix Y from X by renormalizing each of X's rows to have 
    % unit length 
    for i=1:size(X,1)
        n = sqrt(sum(X(i,:).^2));    
        Y(i,:) = X(i,:) ./ n; 
    end
    %Y
    % Treating each row of Y as a point in Rk, cluster them into k 
    % clusters via K-means or any other algorithm
    
    [indices,aux] = kmeans(Y,k,'EmptyAction','singleton','Replicates',10);

end
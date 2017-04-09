from sklearn import svm
from sklearn.metrics import confusion_matrix
import numpy as np

dir_path = './dataset/'

def load_data(dir_path):
    train_X = np.load(dir_path + 'train_X.npy')
    train_Y = np.load(dir_path + 'train_Y.npy')
    train = (train_X, train_Y)
    test_X = np.load(dir_path + 'test_X.npy')
    test_Y = np.load(dir_path + 'test_Y.npy')
    test = (test_X, test_Y)
    return train, test

train, test = load_data(dir_path)

linear_classifier = svm.LinearSVC()
linear_classifier.fit(train[0], train[1])

pred = linear_classifier.predict(test[0])

cfm = confusion_matrix(test[1], pred)

print cfm

size = np.shape(cfm)
true = 0
total = float(np.sum(np.sum(cfm, axis=0)))
for i in range(0, np.shape(cfm)[0]):
    true += cfm[i][i]

print 'Accuracy : ' + str(true/total * 100)